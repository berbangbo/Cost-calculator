const M = document.getElementById('materials');

const money = n =>
  '฿' + Number(n || 0).toLocaleString('th-TH',{
    minimumFractionDigits:2,
    maximumFractionDigits:2
  });


// =========================
// MATERIAL
// =========================

function addMaterial(){

  const el = document.createElement('div');

  el.className = 'material';

  el.innerHTML = `
    <div class="grid">

      <label>
        วัสดุ
        <input class="name" placeholder="เช่น เหล็กกล่อง 1x1">
      </label>

      <label>
        วิธีคิด
        <select class="type">

          <option value="piece">
            ต่อชิ้น / หน่วย
          </option>

          <option value="length">
            ต่อเมตร
          </option>

          <option value="area">
            ตามพื้นที่
          </option>

        </select>
      </label>

      <label>
        ราคาซื้อ
        <input class="price" type="number" min="0" placeholder="บาท">
      </label>

    </div>

    <div class="grid3">

      <label class="size1-label">
        ความยาวที่ซื้อ (ม.)
        <input class="s1" type="number" min="0">
      </label>

      <label class="size2-label">
        ยาวที่ซื้อ (ซม.)
        <input class="s2" type="number" min="0">
      </label>

      <label>
        ใช้ไป
        <input class="qty" type="number" min="0" step="0.01" placeholder="จำนวน">
      </label>

    </div>

    <div class="costline">
      <span>ต้นทุนรายการนี้</span>
      <span class="cost">฿0.00</span>
    </div>

    <div style="text-align:right">
      <button type="button" class="del">
        ลบวัสดุ
      </button>
    </div>
  `;

  M.appendChild(el);


  el.querySelectorAll('input,select')
    .forEach(x => x.addEventListener('input',calc));


  el.querySelector('.del')
    .addEventListener('click',()=>{
      el.remove();
      calc();
    });


  el.querySelector('.type')
    .addEventListener('change',()=>{
      updateLabels(el);
      calc();
    });


  updateLabels(el);
}


// =========================
// LABEL
// =========================

function updateLabels(el){

  const t = el.querySelector('.type').value;

  const l1 = el.querySelector('.size1-label');
  const l2 = el.querySelector('.size2-label');


  if(t === 'length'){

    l1.firstChild.textContent =
      'ความยาวที่ซื้อ (ม.)';

    l2.style.display = 'none';

  }

  else if(t === 'area'){

    l1.firstChild.textContent =
      'กว้างที่ซื้อ (ซม.)';

    l2.firstChild.textContent =
      'ยาวที่ซื้อ (ซม.)';

    l2.style.display = 'block';

  }

  else{

    l1.firstChild.textContent =
      'ขนาดอ้างอิง (ถ้ามี)';

    l2.style.display = 'none';

  }

}


// =========================
// CALCULATE
// =========================

function calc(){

  let mat = 0;


  M.querySelectorAll('.material').forEach(el=>{

    const p =
      +el.querySelector('.price').value || 0;

    const q =
      +el.querySelector('.qty').value || 0;

    const t =
      el.querySelector('.type').value;

    const s1 =
      +el.querySelector('.s1').value || 0;

    const s2 =
      +el.querySelector('.s2').value || 0;


    let c = 0;


    if(t === 'piece')
      c = p * q;


    if(t === 'length')
      c = s1 > 0 ? p * (q / s1) : 0;


    if(t === 'area')
      c =
        (s1 > 0 && s2 > 0)
        ? p * (q / (s1 * s2))
        : 0;


    el.querySelector('.cost').textContent =
      money(c);


    mat += c;

  });


  const lab =
    +document.getElementById('labor').value || 0;

  const sell =
    +document.getElementById('selling').value || 0;


  document.getElementById('mat').textContent =
    money(mat);

  document.getElementById('lab').textContent =
    money(lab);

  document.getElementById('total').textContent =
    money(mat + lab);

  document.getElementById('profit').textContent =
    money(sell - mat - lab);

}


// =========================
// IMAGE
// =========================

let jobImageData = '';


document.getElementById('jobImage')
  .addEventListener('change', function(){

    const file = this.files[0];

    if(!file) return;


    const reader = new FileReader();


    reader.onload = function(e){

      jobImageData = e.target.result;


      const preview =
        document.getElementById('imagePreview');


      preview.innerHTML =
        `<img src="${jobImageData}" alt="รูปงาน">`;


      preview.style.display = 'block';

    };


    reader.readAsDataURL(file);

  });


// =========================
// ADD MATERIAL
// =========================

document.getElementById('add')
  .addEventListener('click',addMaterial);


document.getElementById('labor')
  .addEventListener('input',calc);


document.getElementById('selling')
  .addEventListener('input',calc);


document.getElementById('difficulty')
  .addEventListener('change',e=>{

    const base =
      [0,100,200,300,400,500];

    document.getElementById('labor').value =
      base[+e.target.value];

    calc();

  });


// =========================
// PDF EXPORT
// =========================

const pdfBtn = document.createElement('button');

pdfBtn.type = 'button';
pdfBtn.textContent = '📄 บันทึกเป็น PDF';
pdfBtn.style.marginTop = '10px';

document.body.appendChild(pdfBtn);


pdfBtn.addEventListener('click', async () => {

  // ตรวจสอบ library
  if (!window.html2canvas || !window.jspdf) {
    alert('ระบบ PDF ยังโหลดไม่เสร็จ กรุณาลองใหม่อีกครั้ง');
    return;
  }

  const { jsPDF } = window.jspdf;

  // -------------------------
  // ข้อมูลพื้นฐาน
  // -------------------------

  const jobName =
    document.getElementById('jobName').value.trim() || 'ไม่มีชื่อชิ้นงาน';

  const detail =
    document.getElementById('jobDetail').value.trim() || '-';

  const date =
    new Date().toLocaleDateString('th-TH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });


  // -------------------------
  // ดึงข้อมูลวัสดุ
  // -------------------------

  const materials = [];

  M.querySelectorAll('.material').forEach(el => {

    const name =
      el.querySelector('.name').value || '-';

    const type =
      el.querySelector('.type').value;

    const price =
      +el.querySelector('.price').value || 0;

    const qty =
      +el.querySelector('.qty').value || 0;

    const s1 =
      +el.querySelector('.s1').value || 0;

    const s2 =
      +el.querySelector('.s2').value || 0;

    const cost =
      el.querySelector('.cost').textContent;


    let typeText = 'ต่อชิ้น / หน่วย';

    if (type === 'length')
      typeText = 'ต่อเมตร';

    if (type === 'area')
      typeText = 'ตามพื้นที่';


    let useText = qty;

    if (type === 'length') {
      useText = qty + ' ม.';
    }

    if (type === 'area') {
      useText = qty.toLocaleString('th-TH') + ' ตร.ซม.';
    }


    materials.push({
      name,
      typeText,
      price,
      useText,
      cost
    });

  });


  // -------------------------
  // สร้าง HTML สำหรับ PDF
  // -------------------------

  const report = document.createElement('div');

  report.style.position = 'fixed';
  report.style.left = '-10000px';
  report.style.top = '0';

  report.style.width = '794px';

  report.style.background = '#ffffff';
  report.style.color = '#202124';

  report.style.padding = '50px';

  report.style.fontFamily =
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif';

  report.style.fontSize = '16px';

  report.style.lineHeight = '1.55';


  // -------------------------
  // รูปงาน
  // -------------------------

  let imageHTML = '';

  if (jobImageData) {

    imageHTML = `
      <img
        src="${jobImageData}"
        style="
          width:100%;
          max-height:300px;
          object-fit:contain;
          border-radius:12px;
          border:1px solid #ddd;
          background:#f5f5f5;
        "
      >
    `;

  } else {

    imageHTML = `
      <div style="
        height:180px;
        border:1px dashed #bbb;
        border-radius:12px;
        display:flex;
        align-items:center;
        justify-content:center;
        color:#999;
      ">
        ไม่มีรูปงาน
      </div>
    `;

  }


  // -------------------------
  // รายการวัสดุ
  // -------------------------

  let materialRows = '';

  materials.forEach(item => {

    materialRows += `
      <tr>

        <td style="
          padding:10px;
          border-bottom:1px solid #ddd;
        ">
          ${escapeHTML(item.name)}
        </td>

        <td style="
          padding:10px;
          border-bottom:1px solid #ddd;
          text-align:center;
        ">
          ${item.typeText}
        </td>

        <td style="
          padding:10px;
          border-bottom:1px solid #ddd;
          text-align:center;
        ">
          ${item.useText}
        </td>

        <td style="
          padding:10px;
          border-bottom:1px solid #ddd;
          text-align:right;
          font-weight:600;
        ">
          ${item.cost}
        </td>

      </tr>
    `;

  });


  // -------------------------
  // HTML ทั้งรายงาน
  // -------------------------

  report.innerHTML = `

    <div style="
      border-bottom:4px solid #202124;
      padding-bottom:18px;
      margin-bottom:24px;
    ">

      <div style="
        font-size:30px;
        font-weight:800;
      ">
        🔧 Cost Calculator
      </div>

      <div style="
        color:#777;
        margin-top:3px;
      ">
        สรุปต้นทุนงานช่าง
      </div>

    </div>


    <div style="
      display:flex;
      justify-content:space-between;
      align-items:flex-start;
      margin-bottom:20px;
    ">

      <div>

        <div style="
          color:#777;
          font-size:14px;
        ">
          ชื่องาน
        </div>

        <div style="
          font-size:26px;
          font-weight:800;
        ">
          ${escapeHTML(jobName)}
        </div>

      </div>


      <div style="
        text-align:right;
        color:#666;
        font-size:14px;
      ">
        วันที่<br>
        ${date}
      </div>

    </div>


    <div style="
      display:grid;
      grid-template-columns:42% 58%;
      gap:20px;
      margin-bottom:28px;
    ">

      <div>
        ${imageHTML}
      </div>


      <div>

        <div style="
          font-size:18px;
          font-weight:800;
          margin-bottom:8px;
        ">
          รายละเอียดงาน
        </div>

        <div style="
          white-space:pre-wrap;
          border:1px solid #ddd;
          border-radius:12px;
          padding:14px;
          min-height:180px;
          background:#fafafa;
        ">
          ${escapeHTML(detail)}
        </div>

      </div>

    </div>


    <div style="
      font-size:20px;
      font-weight:800;
      margin-bottom:10px;
    ">
      วัสดุ
    </div>


    <table style="
      width:100%;
      border-collapse:collapse;
      font-size:14px;
      margin-bottom:24px;
    ">

      <thead>

        <tr style="
          background:#202124;
          color:white;
        ">

          <th style="
            padding:10px;
            text-align:left;
          ">
            วัสดุ
          </th>

          <th style="
            padding:10px;
            text-align:center;
          ">
            วิธีคิด
          </th>

          <th style="
            padding:10px;
            text-align:center;
          ">
            ใช้ไป
          </th>

          <th style="
            padding:10px;
            text-align:right;
          ">
            ต้นทุน
          </th>

        </tr>

      </thead>

      <tbody>
        ${materialRows}
      </tbody>

    </table>


    <div style="
      display:flex;
      justify-content:flex-end;
    ">

      <div style="
        width:330px;
        border-top:2px solid #202124;
        padding-top:12px;
      ">

        <div style="
          display:flex;
          justify-content:space-between;
          padding:5px 0;
        ">
          <span>วัสดุ</span>
          <strong>${document.getElementById('mat').textContent}</strong>
        </div>


        <div style="
          display:flex;
          justify-content:space-between;
          padding:5px 0;
        ">
          <span>ค่าแรง</span>
          <strong>${document.getElementById('lab').textContent}</strong>
        </div>


        <div style="
          display:flex;
          justify-content:space-between;
          padding:9px 0;
          margin-top:4px;
          border-top:1px solid #ddd;
          font-size:18px;
        ">
          <strong>ต้นทุนรวม</strong>
          <strong>${document.getElementById('total').textContent}</strong>
        </div>


        <div style="
          display:flex;
          justify-content:space-between;
          padding:9px 0;
        ">
          <strong>ราคาขาย</strong>
          <strong>${money(document.getElementById('selling').value)}</strong>
        </div>


        <div style="
          display:flex;
          justify-content:space-between;
          padding:12px;
          margin-top:5px;
          border-radius:10px;
          background:#202124;
          color:#fff;
          font-size:20px;
        ">
          <strong>กำไร</strong>
          <strong>${document.getElementById('profit').textContent}</strong>
        </div>

      </div>

    </div>


    <div style="
      margin-top:30px;
      padding-top:10px;
      border-top:1px solid #ddd;
      color:#999;
      font-size:11px;
    ">
      Cost Calculator • บันทึกต้นทุนงานช่างส่วนตัว
    </div>

  `;


  document.body.appendChild(report);


  // -------------------------
  // สร้าง PDF
  // -------------------------

  try {

    const canvas =
      await html2canvas(report, {
        scale:2,
        useCORS:true,
        backgroundColor:'#ffffff'
      });


    const imgData =
      canvas.toDataURL('image/jpeg',0.95);


    const pdf =
      new jsPDF({
        orientation:'portrait',
        unit:'mm',
        format:'a4',
        compress:true
      });


    const pageWidth = 210;

    const pageHeight = 297;

    const margin = 10;

    const usableWidth =
      pageWidth - margin * 2;

    const imgWidth =
      usableWidth;

    const imgHeight =
      canvas.height *
      imgWidth /
      canvas.width;


    let heightLeft = imgHeight;

    let position = margin;


    pdf.addImage(
      imgData,
      'JPEG',
      margin,
      position,
      imgWidth,
      imgHeight
    );


    heightLeft -=
      pageHeight - margin * 2;


    while(heightLeft > 0){

      position =
        heightLeft -
        imgHeight +
        margin;

      pdf.addPage();

      pdf.addImage(
        imgData,
        'JPEG',
        margin,
        position,
        imgWidth,
        imgHeight
      );

      heightLeft -=
        pageHeight - margin * 2;

    }


    // -------------------------
    // ชื่อไฟล์
    // -------------------------

    let fileName =
      jobName
        .replace(/[\\/:*?"<>|]/g,'')
        .trim();

    if(!fileName)
      fileName = 'งาน';


    pdf.save(
      `${fileName}.pdf`
    );


  } catch(error){

    console.error(error);

    alert(
      'สร้าง PDF ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'
    );

  }


  report.remove();

});


// =========================
// ป้องกัน HTML แปลก ๆ
// =========================

function escapeHTML(text){

  return String(text)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#039;');

}
